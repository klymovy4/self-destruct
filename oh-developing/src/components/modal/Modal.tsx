import { useEffect, useRef } from 'react'
import classes from './Modal.module.scss'
import { XIcon } from '@phosphor-icons/react'
import { current } from '@reduxjs/toolkit'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  images: string[]
  children: React.ReactNode
  title: string
}

const Modal = ({ onClose, images, isOpen, children, title }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  console.log({ modalRef: dialogRef.current })

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  return (
    <dialog
      className={classes.modal}
      ref={dialogRef}
      onClose={onClose}
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className={classes.content}>
        {' '}
        <button className={classes.close} onClick={onClose}>
          <XIcon size={24} />
        </button>
        {children}
        <p>
          <b>{title}</b>
        </p>
      </div>
    </dialog>
  )
}

export default Modal
